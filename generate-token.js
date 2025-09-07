const admin = require("firebase-admin");

// 🔥 Conecta ao Auth Emulator
process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

// Inicializa o Firebase Admin apontando pro teu projeto
admin.initializeApp({
  projectId: "wimbelem-don-ages2", // usa o mesmo projectId do teu Firebase
});

async function generateToken() {
  try {
    const uid = "test-user"; // UID do usuário fake

    // Cria usuário se não existir
    await admin.auth().getUser(uid).catch(async () => {
      await admin.auth().createUser({
        uid,
        email: "teste@teste.com",
        password: "123456",
        displayName: "Felipe Bisotto (Emulator)"
      });
    });

    // Gera um token custom
    const token = await admin.auth().createCustomToken(uid);

    console.log("\n✅ Token JWT gerado:\n");
    console.log(token);
    console.log("\nUse este token no header Authorization: Bearer <TOKEN>\n");
  } catch (err) {
    console.error("❌ Erro ao gerar token:", err);
  }
}

generateToken();
