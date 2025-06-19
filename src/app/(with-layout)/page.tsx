import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";


export default async function Home() {
  return (

    <div>
      <h1>Codelab</h1>
      <Button>Click me</Button>

    </div>
  );
}
