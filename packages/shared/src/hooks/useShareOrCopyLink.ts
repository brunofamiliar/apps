import { useContext } from 'react';
import LogContext from '../contexts/LogContext';
import type { CopyNotifyFunction } from './useCopy';
import { useCopyLink } from './useCopy';
import { ShareProvider } from '../lib/share';
import type { LogEvent } from './log/useLogQueue';
import { useGetShortUrl } from './utils/useGetShortUrl';
import type { ReferralCampaignKey } from '../lib';
import { shouldUseNativeShare } from '../lib/func';

export interface UseShareOrCopyLinkProps {
  link: string;
  text: string;
  logObject?: (provider: ShareProvider) => LogEvent;
  shortenUrl?: boolean;
  cid?: ReferralCampaignKey;
}
export function useShareOrCopyLink({
  link,
  text,
  logObject,
  cid,
}: UseShareOrCopyLinkProps): ReturnType<typeof useCopyLink> {
  const { logEvent } = useContext(LogContext);
  const [copying, copyLink] = useCopyLink();
  const { getShortUrl } = useGetShortUrl();

  const onShareOrCopy: CopyNotifyFunction = async () => {
    const shortLink = cid ? await getShortUrl(link, cid) : link;

    if (shouldUseNativeShare()) {
      try {
        await navigator.share({
          text: `${text}\n${shortLink}`,
        });
        logEvent(logObject(ShareProvider.Native));
      } catch (err) {
        // Do nothing
      }
    } else {
      logEvent(logObject(ShareProvider.CopyLink));
      copyLink({ link: shortLink });
    }
  };

  return [copying, onShareOrCopy];
}
