"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const CreatorProfile = ({ params }) => {
  const { data: session } = useSession();

  const router = useRouter();
  
  const creatorId = params.id;
  const searchParams = useSearchParams();
  const username = searchParams.get('username');

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!session) return;

    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${creatorId}/posts`);
      const data = await response.json();
      setPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session]); // If the session data is not immediately available on page load, the useEffect will run again once the session data is fetched and available, triggering the fetch for the posts.

  return (
    <Profile
      name={`${username}'s`}
      desc={`Welcome to ${username}'s personalized profile page. Explore ${username}'s exceptional prompts and be inspired by the power of their imagination!`}
      data={posts}
    />
  );
};

export default CreatorProfile;
