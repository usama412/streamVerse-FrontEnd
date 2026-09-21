import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Section, MovieCard } from "../components/UI";
import { userService } from "../services/api";
import { mapContent } from "../apiMapper";
import { Movie } from "../types";
import { useStore } from "../store";

function Empty({ text }: { text: string }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/10 px-6 text-center text-white/40">
      {text}
    </div>
  );
}

export function MyList() {
  const [items, setItems] = useState<Movie[]>([]);
  const { setList } = useStore();

  useEffect(() => {
    const loadMyList = async () => {
      try {
        const x: any[] = await userService.getMyList();

        setItems(x.map((i) => mapContent(i.content)));
        setList(x.map((i) => i.content.id));
      } catch {
        setItems([]);
      }
    };

    loadMyList();
  }, [setList]);

  return (
    <Section
      title="My List"
      subtitle={`${items.length} saved titles`}
    >
      {items.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {items.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      ) : (
        <Empty text="Your list is empty. Add titles you want to watch later." />
      )}
    </Section>
  );
}

export function History() {
  const [items, setItems] = useState<Movie[]>([]);
  const { clearHistory } = useStore();

  const load = async () => {
    try {
      const x: any[] = await userService.getHistory();

      setItems(x.map((i) => mapContent(i.content)));
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function clear() {
    await userService.clearHistory();
    clearHistory();
    setItems([]);
  }

  return (
    <Section
      title="Watch History"
      action={
        items.length ? (
          <button
            onClick={clear}
            className="flex items-center gap-2 text-sm text-red-300"
          >
            <Trash2 size={15} />
            Clear history
          </button>
        ) : null
      }
    >
      {items.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {items.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      ) : (
        <Empty text="Nothing here yet. Start watching and your history will appear here." />
      )}
    </Section>
  );
}