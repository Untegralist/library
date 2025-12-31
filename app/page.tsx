import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-24 space-y-32">

        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Selamat Datang di{" "}
            <span className="text-blue-600">Ayokitanulis</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platform menulis digital untuk siswa SMP dan SMA di seluruh
            Indonesia, didukung oleh Universitas Kristen Petra.
          </p>

          <p className="text-gray-500">
            Apa saja yang dapat kamu lakukan di sini?
          </p>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-2 gap-10">
          {/* Feature Card 1 */}
          <div className="bg-white rounded-3xl shadow-lg p-10 space-y-6">
            <Image
              src="/file.svg"
              alt="Share your writing"
              width={220}
              height={220}
              className="mx-auto"
            />
            <h3 className="text-2xl font-bold text-center">
              Share Your Writing
            </h3>
            <p className="text-gray-600 text-center">
              Bagikan karya tulismu kepada teman-teman dalam komunitas
              untuk mendapatkan masukan dan apresiasi yang membangun.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white rounded-3xl shadow-lg p-10 space-y-6">
            <Image
              src="/globe.svg"
              alt="Give feedback"
              width={220}
              height={220}
              className="mx-auto"
            />
            <h3 className="text-2xl font-bold text-center">
              Give Meaningful Feedback
            </h3>
            <p className="text-gray-600 text-center">
              Dengan saling memberikan feedback, penulis dapat berkembang
              dan meningkatkan kualitas tulisan mereka.
            </p>
          </div>
        </section>

        {/* Competition */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-12 space-y-6 text-center">
            <Image
              src="/window.svg"
              alt="Writing competition"
              width={260}
              height={260}
              className="mx-auto"
            />
            <h3 className="text-3xl font-bold">
              Writing Competition
            </h3>
            <p className="text-gray-600">
              Institusi dapat menggunakan platform ini sebagai sarana
              kompetisi menulis internal yang kreatif dan terstruktur.
            </p>
          </div>
        </section>

        {/* About Us */}
        <section className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-12 space-y-6">
            <h2 className="text-4xl font-bold text-center">
              About Us
            </h2>

            <p className="text-gray-700 text-center max-w-3xl mx-auto">
              <strong className="text-blue-600">Ayokitanulis</strong> adalah
              platform yang bertujuan merangsang kreativitas dan
              kepercayaan diri siswa SMP dan SMA dalam menuangkan ide
              melalui karya tulis digital.
            </p>

            <p className="text-gray-700 text-center max-w-3xl mx-auto">
              Kami membangun komunitas menulis yang saling mendukung dari
              setiap institusi pendidikan.
            </p>

            <ul className="max-w-xl mx-auto space-y-2 text-gray-600">
              <li>✔ Memberikan kode sumber kepada orang lain</li>
              <li>✔ Tidak mengubah atau menghapus lisensi asli</li>
              <li>✔ Menerapkan lisensi yang sama pada karya turunan</li>
            </ul>
          </div>
        </section>
{/* NEW: Genre Section */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Jelajahi Karya Berdasarkan Genre
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Fiction Card */}
            <Link href="/genres/fiction" className="block">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl shadow-xl p-12 space-y-6 transform hover:scale-105 transition duration-300 cursor-pointer">
                <div className="bg-white/20 rounded-2xl w-32 h-32 mx-auto flex items-center justify-center">
                  <span className="text-5xl">📚</span>
                </div>
                <h3 className="text-3xl font-bold text-center">Fiction</h3>
                <p className="text-center text-lg opacity-90">
                  Cerita imajinasi, novel, cerpen, dan karya fiksi kreatif dari para siswa.
                </p>
              </div>
            </Link>

            {/* Non-Fiction Card */}
            <Link href="/genres/non-fiction" className="block">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-3xl shadow-xl p-12 space-y-6 transform hover:scale-105 transition duration-300 cursor-pointer">
                <div className="bg-white/20 rounded-2xl w-32 h-32 mx-auto flex items-center justify-center">
                  <span className="text-5xl">📝</span>
                </div>
                <h3 className="text-3xl font-bold text-center">Non-Fiction</h3>
                <p className="text-center text-lg opacity-90">
                  Esai, artikel ilmiah, laporan, opini, dan tulisan berbasis fakta.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
