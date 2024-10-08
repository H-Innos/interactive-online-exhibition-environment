import { db } from "~/server/db"; 
import { HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic"; 

interface Post {
  id: number; 
  name: string | null; 
  description: string | null; 
  coverImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export default async function Home() {
  const posts: Post[] = await db.query.posts.findMany();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#293957] to-[#c7c9eb] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            UTLib näitused
          </h1>
        </div>
        <div className="flex flex-wrap gap-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="p-4 bg-gray-800 rounded-md">
                {post.name}
              </div>
            ))
          ) : (
            <div>No posts found</div>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
