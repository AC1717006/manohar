const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919649030231";

export default function WhatsAppButton({ text }: { text?: string }) {
  const message = encodeURIComponent(
    text ?? "Namaste! I'm interested in your Rajputi dress collection."
  );

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.39.7 4.617 1.917 6.49L4 29l7.74-1.876A11.93 11.93 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3Zm6.954 16.97c-.296.83-1.476 1.59-2.04 1.677-.52.08-1.176.114-1.898-.12-.437-.142-.998-.33-1.715-.646-3.02-1.305-4.99-4.36-5.14-4.566-.15-.205-1.225-1.63-1.225-3.108 0-1.478.775-2.205 1.05-2.507.276-.302.602-.378.803-.378.2 0 .402.002.577.01.184.009.432-.07.677.516.252.6.853 2.077.93 2.227.075.15.125.327.025.527-.1.2-.15.327-.3.502-.15.176-.314.394-.45.53-.15.15-.305.314-.13.614.174.3.776 1.28 1.666 2.073 1.142 1.018 2.107 1.334 2.404 1.483.296.15.469.125.642-.075.174-.2.747-.872.946-1.17.2-.301.4-.25.677-.15.276.1 1.752.825 2.052.976.3.15.5.225.572.351.075.125.075.726-.22 1.556Z" />
      </svg>
    </a>
  );
}
