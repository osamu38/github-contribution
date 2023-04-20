import { PullRequestFragments, Contributions } from '@/utils/fetchGitHubData';

export const formatGitHubData = (
  githubData: PullRequestFragments,
  username: string | string[] | undefined,
) => {
  const myPullRequests = githubData
    .filter((node) => node.mergedAt !== null && node.author!.login === username)
    .map((node) => {
      const { author, mergedAt, comments, reviews, title, ...rest } = node;
      return { bodyHTML: title, ...rest };
    }) as Contributions;
  const myComments = githubData.reduce(
    (pre, cur) => [
      ...pre,
      ...(cur.author!.login !== username
        ? cur
            .comments!.edges!.filter(
              (comment) =>
                comment!.node!.author!.login === username &&
                !['/e2e', '/hotfix'].includes(comment!.node!.body),
            )
            .map((comment) => {
              const { author, ...rest } = comment!.node!;
              return rest;
            })
        : []),
      ...cur
        .reviews!.edges!.filter(
          (review) =>
            review!.node!.author!.login === username &&
            review!.node!.bodyHTML !== '',
        )
        .map((review) => {
          const { comments, author, ...rest } = review!.node!;
          return rest;
        }),
      ...(cur.author!.login !== username
        ? cur.reviews!.edges!.reduce(
            (innerPre, innerCur) => [
              ...innerPre,
              ...innerCur!
                .node!.comments!.edges!.filter(
                  (reviewComment) =>
                    reviewComment!.node!.author!.login === username,
                )
                .map((reviewComment) => {
                  const { author, ...rest } = reviewComment!.node!;
                  return rest;
                }),
            ],
            [] as any,
          )
        : []),
    ],
    [] as Contributions,
  );

  return {
    myPullRequests,
    myComments,
  };
};
