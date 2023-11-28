/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("https://msha.ke/bookingstudio");
  }, []);
}
