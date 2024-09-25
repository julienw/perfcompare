import { useState } from 'react';

import { Grid } from '@mui/material';
import { Container } from '@mui/system';
import { useLoaderData } from 'react-router-dom';
import { style } from 'typestyle';

import { subtestsView, subtestsOverTimeView } from '@/common/constants';
import { useAppSelector } from '@/hooks/app';
import useRawSearchParams from '@/hooks/useRawSearchParams';
import { Colors, Spacing } from '@/styles';
import type { SubtestsRevisionsHeader } from '@/types/state';
import DownloadButton from '.././DownloadButton';
import SearchInput from '.././SearchInput';
import RetriggerButton from '../Retrigger/RetriggerButton';
import { LoaderReturnValue } from '../subtestsLoader';
import { LoaderReturnValue as OvertimeLoaderReturnValue } from '../subtestsOverTimeLoader';
import SubtestsBreadcrumbs from './SubtestsBreadcrumbs';
import SubtestsResultsTable from './SubtestsResultsTable';
import SubtestsRevisionHeader from './SubtestsRevisionHeader';

type SubtestsResultsMainProps = {
  view: typeof subtestsView | typeof subtestsOverTimeView;
};

function SubtestsResultsMain({ view }: SubtestsResultsMainProps) {
  const { results } = useLoaderData() as
    | LoaderReturnValue
    | OvertimeLoaderReturnValue;

  const themeMode = useAppSelector((state) => state.theme.mode);

  // This is our custom hook that updates the search params without a rerender.
  const [rawSearchParams, updateRawSearchParams] = useRawSearchParams();
  const initialSearchTerm = rawSearchParams.get('search') ?? '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const subtestsHeader: SubtestsRevisionsHeader = {
    suite: results[0].suite,
    framework_id: results[0].framework_id,
    test: results[0].test,
    option_name: results[0].option_name,
    extra_options: results[0].extra_options,
    new_rev: results[0].new_rev,
    new_repo: results[0].new_repository_name,
    platform: results[0].platform,
  };

  const themeColor100 =
    themeMode === 'light' ? Colors.Background300 : Colors.Background100Dark;

  const styles = {
    container: style({
      backgroundColor: themeColor100,
      margin: '0 auto',
      marginBottom: '80px',
    }),
    title: style({
      margin: 0,
      marginBottom: Spacing.Medium,
    }),
  };

  const onSearchTermChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    if (newSearchTerm) {
      rawSearchParams.set('search', newSearchTerm);
    } else {
      rawSearchParams.delete('search');
    }
    updateRawSearchParams(rawSearchParams);
  };

  return (
    <Container className={styles.container} data-testid='subtests-main'>
      <header>
        <SubtestsBreadcrumbs view={view} />
        <SubtestsRevisionHeader header={subtestsHeader} />
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} sx={{ marginInlineEnd: 'auto' }}>
            <SearchInput
              defaultValue={initialSearchTerm}
              onChange={onSearchTermChange}
            />
          </Grid>
          <Grid item xs='auto'>
            <DownloadButton resultsPromise={[results]} />
          </Grid>
          <Grid item xs='auto'>
            <RetriggerButton result={results[0]} variant='text' />
          </Grid>
        </Grid>
      </header>
      <SubtestsResultsTable
        filteringSearchTerm={searchTerm}
        results={results}
      />
    </Container>
  );
}

export default SubtestsResultsMain;
