import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTrackVisibility } from "react-intersection-observer-hook";
import {
  getAllGames,
  getGamesCount,
} from "~/api/supabase-steam.server";
import Button from "~/components/Button";
import Card from "~/components/Card";
import Carousel from "~/components/Carousel";
import Container from "~/components/Container";
import Loader from "~/components/Loader";
import SilentText from "~/components/SilentText";
import Title from "~/components/Title";
import { useHydrated } from "~/hooks/useHydrated";
import type { Game } from "~/types";

import type {
  ActionFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
  useTransition,
} from "@remix-run/react";

type Sorts = "price-asc" | "price-desc" | "name-asc" | "name-desc";
const SortNames: Record<Sorts, Sorts> = {
  "price-asc": "price-asc",
  "price-desc": "price-desc",
  "name-asc": "name-asc",
  "name-desc": "name-desc",
};

type LoaderData = {
  games: Game[];
  gamesCount: number;
  page?: number;
};
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("q") || "";
  const page = Number(url.searchParams.get("page"));
  const limit = Number(url.searchParams.get("limit"));
  const sort = url.searchParams.get("sort");
  if (page === 0 && limit === 0 && !sort && sort !== "") {
    return redirect(`?page=1&limit=10&sort=${SortNames["price-desc"]}`);
  }

  let sortColumn: keyof Pick<Game, "title" | "price"> = "price";
  if (sort?.includes("name")) {
    sortColumn = "title";
  }
  let sortOrder: "asc" | "desc" = "asc";
  if (sort?.includes("desc")) {
    sortOrder = "desc";
  }
  const { count, error: countError } = await getGamesCount(search);
  const { games, error } = await getAllGames(
    0,
    page * limit - 1,
    search,
    sortColumn,
    sortOrder,
  );
  if (error || !games || countError || !count) {
    return json<LoaderData>({
      games: [],
      gamesCount: 0,
      page: search !== "" ? 1 : undefined,
    });
  }
  return json<LoaderData>({
    games,
    gamesCount: count,
    page: search !== "" ? 1 : undefined,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const search = formData.get("search");
  const sort = formData.get("sort");
  const page = formData.get("page");
  const searchParams = new URL(request.url).searchParams;
  if (
    search === undefined &&
    search === null &&
    sort === undefined &&
    sort === null &&
    page === undefined &&
    page === null
  ) {
    return redirect(request.url);
  }
  if (search !== undefined && search !== null) {
    searchParams.set("q", String(search));
  }
  if (sort !== undefined && sort !== null) {
    searchParams.set("sort", String(sort));
  }
  if (page !== undefined && page !== null) {
    searchParams.set("page", String(page));
  }
  return redirect(`?${searchParams.toString()}`);
};

export default function Screen() {
  const { games, gamesCount, page: loaderPage } = useLoaderData<LoaderData>();
  const isHydrated = useHydrated();
  const search = useSubmit();
  const loadMoreGames = useSubmit();
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState<string>(searchParams.get("q") || "");
  const [sort, setSort] = useState<string>(
    searchParams.get("sort") || SortNames["price-desc"],
  );
  const transition = useTransition();
  const [sentryRef, { isVisible }] = useTrackVisibility({
    rootMargin: "0px 0px 400px 0px",
  });

  const page = useMemo(
    () => loaderPage || searchParams.get("page") || "1",
    [searchParams, loaderPage],
  );
  const limit = useMemo(
    () => searchParams.get("limit") || "10",
    [searchParams],
  );
  const hasNextPage = useMemo(() => {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    return pageNumber * limitNumber < gamesCount;
  }, [page, limit, gamesCount]);
  const shouldLoadMore = useMemo(
    () => !transition.submission && isVisible && hasNextPage,
    [transition, isVisible, hasNextPage],
  );
  const showingNumberOfGames = useMemo(() => {
    if (Number(page) * Number(limit) > gamesCount) {
      return gamesCount;
    }
    return Number(page) * Number(limit);
  }, [page, limit, gamesCount]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQ(e.target.value);

      const formData = new FormData();
      formData.set("q", e.target.value);
      searchParams.delete("q");
      search(formData, {
        method: "get",
        action: `?${searchParams.toString()}`,
      });
    },
    [search, searchParams],
  );
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSort(e.target.value);

      const formData = new FormData();
      formData.set("sort", e.target.value);
      searchParams.delete("sort");
      search(formData, {
        method: "get",
        action: `?${searchParams.toString()}`,
      });
    },
    [search, searchParams],
  );

  useEffect(() => {
    if (shouldLoadMore) {
      // When we trigger 'onLoadMore' and new items are added to the list,
      // right before they become rendered on the screen, 'loading' becomes false
      // and 'isVisible' can be true for a brief time, based on the scroll position.
      // So, it triggers 'onLoadMore' just after the first one is finished.
      // We use a small delay here to prevent this kind of situations.
      // It can be configured by hook args.
      const timer = setTimeout(() => {
        searchParams.set("page", String(Number(page) + 1));
        loadMoreGames(
          {},
          {
            method: "get",
            action: `?${searchParams.toString()}`,
          },
        );
      }, 100);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loadMoreGames, shouldLoadMore, page, searchParams]);

  return (
    <>
      {isHydrated ? <Carousel games={games.slice(0, 6)} /> : null}
      <div className="mt-10 overflow-x-hidden pl-5 lg:pl-20">
        <Title>New & Trending</Title>
      </div>
      <Container className="pb-10">
        <div className="align-center flex flex-col justify-between md:flex-row">
          <Form
            method="post"
            action={`?index&${searchParams.toString()}`}
            className="mt-4"
          >
            <input
              placeholder="Search"
              type="search"
              name="search"
              value={q}
              onChange={handleSearchChange}
              className="w-[100%] rounded-primary bg-primary px-5 py-2 lg:w-auto"
            />
            {!isHydrated ? (
              <Button
                type="submit"
                className="mt-3 block lg:ml-3 lg:mt-0 lg:inline-block"
              >
                Search
              </Button>
            ) : null}
          </Form>
          <Form
            method="post"
            action={`?index&${searchParams.toString()}`}
            className="mt-4"
          >
            <label htmlFor="sort" className="mr-3">
              Sort by:
            </label>
            <select
              name="sort"
              id="sort"
              className="max-w-[250px] rounded-primary bg-primary py-2 pl-6 pr-8 text-text"
              value={sort}
              onChange={handleSortChange}
            >
              <option value={SortNames["price-asc"]}>Price: low to high</option>
              <option value={SortNames["price-desc"]}>
                Price: hight to low
              </option>
              <option value={SortNames["name-asc"]}>Name: ascending</option>
              <option value={SortNames["name-desc"]}>Name: descending</option>
            </select>
            {!isHydrated ? (
              <Button
                type="submit"
                className="mt-3 block sm:ml-3 sm:mt-0 sm:inline-block"
              >
                Sort
              </Button>
            ) : null}
          </Form>
        </div>
        <SilentText className="mt-4">
          Showing {showingNumberOfGames} of {gamesCount} games in page {page}
        </SilentText>
        {transition.submission?.formData.has("q") ||
        transition.submission?.formData.has("sort") ? (
          <Loader className="mt-4 h-28 w-28" />
        ) : (
          <>
            {games.map((game) => (
              <Card key={game.id} game={game} />
            ))}
            {isHydrated && hasNextPage ? (
              <div ref={sentryRef}>
                <Loader className="mt-4 h-10 w-10" />
              </div>
            ) : null}
            {!isHydrated && hasNextPage ? (
              <Form
                method="post"
                action={`?index&${searchParams.toString()}`}
                className="mt-4 text-center"
              >
                <input
                  type="hidden"
                  name="page"
                  value={String(Number(page) + 1)}
                />
                <Button
                  type="submit"
                  className="mt-3 block sm:ml-3 sm:mt-0 sm:inline-block"
                >
                  Load more
                </Button>
              </Form>
            ) : null}
          </>
        )}
      </Container>
    </>
  );
}
