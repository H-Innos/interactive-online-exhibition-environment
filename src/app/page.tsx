import { db } from "~/server/db"; 
import { HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic"; 

interface Exhibition {
  id: number; 
  name: string | null; 
  description: string | null; 
  coverImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export default async function Home() {
  const exhibitions: Exhibition[] = await db.query.exhibitions.findMany();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-black">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Visitor view of all exhibitions will be here.
          </h1>
        </div>
      </main>
    </HydrateClient>
  );
}
