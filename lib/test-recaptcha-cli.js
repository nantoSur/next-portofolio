import fetch from "node-fetch";

// Token palsu tapi valid untuk test
const fakeToken = "test_token";
// Gunakan test secret key dari Google
const secretKey = "6LdwraYrAAAAAMv0pjmbhjATZ_rPkulR5lMNZ7II";

async function verifyRecaptcha() {
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${fakeToken}`,
    });

    const data = await res.json();
    console.log("Response dari Google reCAPTCHA:", data);
  } catch (error) {
    console.error("Gagal verifikasi:", error);
  }
}

verifyRecaptcha();
