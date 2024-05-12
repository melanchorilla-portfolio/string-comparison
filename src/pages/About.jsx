const About = () => {
  return (
    <main className="container flex px-20 h-[90vh] justify-center items-center">
      <div className="mx-auto">
        <h1 className="sm:text-xl md:text-2xl font-semibold text-center my-2">
          Tentang Website Ini
        </h1>
        <p className="text-center my-2">
          Website Perbandingan Autocorrect Speech Recognition ini dapat
          melakukan koreksi otomatis dengan saran pengejaan menggunakan metode
          edit distance.
        </p>
        <p className="text-center my-2">
          Website perbandingan ini dibangun untuk mengecek kinerja kedua
          algoritma serta implementasi dari aplikasi speech recognition
          menggunakan algoritma edit distance (Jaro-Winkler & Leventhein
          Distance) dengan kalimat bahasa inggris native U.S
        </p>
      </div>
    </main>
  );
};

export default About;
