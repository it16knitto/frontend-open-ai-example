import Chat from "./chat";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Intergration OpenAI TEST</h1>
      <Chat />
    </main>
  );
}