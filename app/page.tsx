"use client";

import { useEffect, useState } from "react";

// Redux
import { useDispatch } from "react-redux";
import { replaceState } from "@/redux/todosSlice";

// Components
import { TodoTable } from "@/components/todoTable";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function Home() {
  const dispatch = useDispatch();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("todosState");
    if (saved) {
      const parsed = JSON.parse(saved);
      dispatch(replaceState(parsed));
    }
    setHydrated(true);
  }, [dispatch]);

  if (!hydrated) return <SkeletonCard />;

  return (
    <div>
      <TodoTable />
    </div>
  );
}