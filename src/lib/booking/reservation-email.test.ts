import { test } from "node:test";
import { strict as assert } from "node:assert";
import { PDFDocument } from "pdf-lib";
import { createReservationPdf } from "./reservation-pdf";
import { sendReservationEmail } from "./reservation-email.server";

const booking = {
  booking_number: "AFR-TEST-1001",
  guest_name: "Жахонгир",
  guest_lastname: "Шарипов",
  guest_email: "guest@example.com",
  room_type: "Standard King",
  check_in_date: "2026-12-10",
  check_out_date: "2026-12-12",
};

test("reservation PDF accepts Cyrillic names and produces one valid page", async () => {
  const bytes = await createReservationPdf(booking);
  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getPageCount(), 1);
  assert.match(pdf.getTitle() ?? "", /AFR-TEST-1001/);
});

test("confirmation goes to guest with PDF and hidden copy to hotel's requested email", async () => {
  const originalFetch = globalThis.fetch;
  const originalGateway = process.env["LOVABLE_API_KEY"];
  const originalConnection = process.env["RESEND_API_KEY"];
  process.env["LOVABLE_API_KEY"] = "test-gateway";
  process.env["RESEND_API_KEY"] = "test-connection";
  let calls = 0;
  globalThis.fetch = async (url, init) => {
    calls++;
    assert.equal(url, "https://connector-gateway.lovable.dev/resend/emails");
    const body = JSON.parse(String(init?.body));
    assert.deepEqual(body.to, ["guest@example.com"]);
    assert.deepEqual(body.bcc, ["jaxongir.sh2006@gmail.com"]);
    assert.equal(new Headers(init?.headers).get("Idempotency-Key"), "reservation-AFR-TEST-1001");
    for (const value of ["Жахонгир", "Шарипов", "Standard King", "2026-12-10", "2026-12-12", "AFR-TEST-1001"]) {
      assert.ok(body.text.includes(value));
    }
    assert.equal(body.attachments[0].filename, "AFR-TEST-1001.pdf");
    const pdf = await PDFDocument.load(Buffer.from(body.attachments[0].content, "base64"));
    assert.equal(pdf.getPageCount(), 1);
    return Response.json({ id: "test-email-id" });
  };
  try {
    assert.deepEqual(await sendReservationEmail(booking), { id: "test-email-id" });
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalGateway === undefined) delete process.env["LOVABLE_API_KEY"]; else process.env["LOVABLE_API_KEY"] = originalGateway;
    if (originalConnection === undefined) delete process.env["RESEND_API_KEY"]; else process.env["RESEND_API_KEY"] = originalConnection;
  }
});