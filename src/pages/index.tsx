import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    void router.replace("/learn/5");
  }, [router]);

  return <main className="min-h-screen bg-black"></main>;
}
