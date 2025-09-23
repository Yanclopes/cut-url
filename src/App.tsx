import { useState } from "react";

export default function CutUrlForm() {
  const [link, setLink] = useState("");
  const [code, setCode] = useState("");
  const [expiration, setExpiration] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!link) {
      alert("Por favor, insira um link.");
      return;
    }
    console.log({ link, code, expiration });
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center mb-10 flex items-center justify-center gap-2">
      Cut/Url
    </h1>
      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="link" className="block mb-2 font-semibold text-gray-700">
            Link <span className="text-red-500">*</span>
          </label>
          <input
            id="link"
            type="url"
            required
            placeholder="https://example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="code" className="block mb-2 font-semibold text-gray-700">
            Código (opcional)
          </label>
          <input
            id="code"
            type="text"
            placeholder="Seu código customizado"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="expiration" className="block mb-2 font-semibold text-gray-700">
            Data de Expiração (opcional)
          </label>
          <input
            id="expiration"
            type="date"
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md hover:bg-purple-700 transition"
        >
          Criar link
        </button>
      </form>
    </div>
  );
}
