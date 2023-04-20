import { SearchQuery, PullRequestFragment } from '@/graphql/types';
import { client } from '@/utils/client';

export type PullRequestFragments = NonNullable<PullRequestFragment>[];

export type Contributions = {
  bodyHTML: string;
  url: string;
}[];

export const fetchGitHubData = async (
  params: {
    pat: string;
    username: string;
    startDate: string;
    endDate: string;
  },
  data: PullRequestFragments = [],
  cursor: string | null = null,
): Promise<PullRequestFragments> => {
  const {
    search: { edges, issueCount },
  } = await client.search(
    {
      query: `involves:${params.username} created:${params.startDate}..${params.endDate}`,
      cursor,
    },
    {
      authorization: `bearer ${params.pat}`,
    },
  );
  const mergedData = [...data!, ...edges!.map((edge) => edge?.node)];
  const needFetch = mergedData.length < issueCount;

  if (needFetch) {
    return await fetchGitHubData(
      params,
      mergedData as PullRequestFragments,
      edges!.at(-1)!.cursor,
    );
  }
  return mergedData as PullRequestFragments;
};
