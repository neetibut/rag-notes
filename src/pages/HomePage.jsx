const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100">
      <h1 className="text-5xl font-extrabold mb-8 text-black text-center max-w-2xl border-4 border-black rounded-2xl bg-pink-200 py-6 px-4 shadow-[8px_8px_0_0_#000]">
        Hassle-free note taking, publish and share your notes with AI summarizer.
      </h1>
      <p className="text-black font-mono text-lg border-2 border-black rounded-lg bg-white py-3 px-6 shadow-[2px_2px_0_0_#000] text-center">
        Please{' '}
        <a href="/login" className="text-blue-700 font-bold underline hover:text-blue-900">
          Login
        </a>{' '}
        to continue.
      </p>
    </div>
  );
};

export default HomePage;
