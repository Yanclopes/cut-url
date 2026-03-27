import { useState } from "react";
import QRCode from "react-qr-code";

export default function CutUrlForm() {
    const [link, setLink] = useState("");
    const [code, setCode] = useState("");
    const [expiration, setExpiration] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!link) {
            alert("Por favor, insira um link.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(import.meta.env.VITE_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: link,
                    code: code || undefined,
                    expiredIn: expiration ? new Date(expiration).toISOString() : undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            const finalUrl = `${import.meta.env.VITE_API_URL}/${data.code}`;
            setShortUrl(finalUrl);
        } catch (err: any) {
            alert(err.message || "Erro ao criar o link encurtado.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadQR = () => {
        const svg = document.getElementById("qr-code");
        if (!svg) return;
        const serializer = new XMLSerializer();
        const svgData = serializer.serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            const a = document.createElement("a");
            a.download = "qrcode.png";
            a.href = canvas.toDataURL("image/png");
            a.click();
        };
        img.src = url;
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
                    disabled={loading}
                    className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
                >
                    {loading ? "Criando..." : "Criar link"}
                </button>
            </form>

            {shortUrl && (
                <div className="mt-10 text-center space-y-4">
                    <p className="text-lg font-medium text-gray-800">
                        Seu link encurtado:
                    </p>
                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 font-semibold break-all hover:underline"
                    >
                        {shortUrl}
                    </a>

                    <div className="mt-6 flex flex-col items-center gap-3">
                        <QRCode id="qr-code" value={shortUrl} />
                        <button
                            onClick={handleDownloadQR}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold transition"
                        >
                            Baixar QR Code
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
