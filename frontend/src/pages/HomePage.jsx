import { useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import { useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchNotes = async (pageToLoad = 1) => {
      try {
        const res = await api.get(`/notes?page=${pageToLoad}&limit=9`);
        const { data, pagination } = res.data;
        setNotes((prev) => (pageToLoad === 1 ? data : [...prev, ...data]));
        setHasMore(pagination?.hasMore ?? false);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes");
        console.log(error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes(1);
  }, []);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoading(true);
    await (async () => {
      try {
        const res = await api.get(`/notes?page=${nextPage}&limit=9`);
        const { data, pagination } = res.data;
        setNotes((prev) => [...prev, ...data]);
        setHasMore(pagination?.hasMore ?? false);
      } catch (error) {
        if (!isRateLimited) toast.error("Failed to load more notes");
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
        {hasMore && !isRateLimited && (
          <div className="flex justify-center mt-8">
            <button className="btn btn-outline" onClick={handleLoadMore} disabled={loading}>
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;