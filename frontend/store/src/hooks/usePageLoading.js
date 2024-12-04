import { useEffect } from 'react';
import { useLoading } from '../contexts/LoadingContext';

export const usePageLoading = (isDataLoading = false) => {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(isDataLoading);
  }, [isDataLoading, setIsLoading]);
};
