import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const posts = await db.query.posts.findMany();
  
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#293957] to-[#c7c9eb] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            UTLib näitused
          </h1>
        </div>
        <div className="flex flex-wrap gap-4">
          {/* database test */}
          {posts.map(post => <div key={post.id}>{post.name}</div>)}
        </div>
      </main>
    </HydrateClient>
  );
}
