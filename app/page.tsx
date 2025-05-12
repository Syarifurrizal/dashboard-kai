
import Image from "next/image";

export default function Home() {
  return (
      <div className="flex flex-col h-screen">
        <div className="flex-grow flex flex-col h-full justify-center items-center text-center p-6">
          <div className="relative w-full max-w-md h-48 mb-8">
            <Image
              src="/KAI.svg"
              alt="Background KAI"
              layout="fill"
              objectFit="contain"
            />
          </div>

          <h1 className="font-bold text-4xl text-slate-900 dark:text-slate-50 mb-2">
            Selamat Datang
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
            Sarana KAI DAOP 6
          </p>

          {/* <p className="text-sm text-gray-600">
            {latestUpdate
              ? `Upload data terbaru pada: ${latestUpdate.toLocaleString()}`
              : "Tidak ada data terbaru."}
          </p> */}

        </div>
      </div>
  );
}
