"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleCreatorClick, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleCreatorClick={handleCreatorClick}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/prompt");
        const data = await response.json();
        setAllPosts(data);
        setDisplayedPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);

    const filteredPosts = allPosts.filter((post) => {
      const regex = new RegExp(e.target.value, "i");

      const creatorMatch = regex.test(post.creator.username);
      const promptMatch = regex.test(post.prompt);
      const tagMatch = regex.test(post.tag);

      return creatorMatch || promptMatch || tagMatch;
    });

    setDisplayedPosts(filteredPosts);
  };

  const handleTagClick = (tag) => {
    const filteredPosts = allPosts.filter((post) => {
      const regex = new RegExp(tag, "i");
      return regex.test(post.tag);
    });
    
    setDisplayedPosts(filteredPosts);
  }

  const handleCreatorClick = (creator) => {
    router.push(`/profile/${creator._id}?username=${creator.username}`);
  }

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={displayedPosts} handleCreatorClick={handleCreatorClick} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
