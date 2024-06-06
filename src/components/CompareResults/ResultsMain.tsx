import { useState, useMemo } from 'react';

import { Container } from '@mui/system';
import { style } from 'typestyle';

import { useAppSelector } from '../../hooks/app';
import { Colors, Spacing } from '../../styles';
import type { CompareResultsItem } from '../../types/state';
import DownloadButton from './DownloadButton';
import ResultsTable from './ResultsTable';
import RevisionSelect from './RevisionSelect';
import SearchInput from './SearchInput';

function ResultsMain(props: { results: CompareResultsItem[][] }) {
  const themeMode = useAppSelector((state) => state.theme.mode);
  const [searchTerm, setSearchTerm] = useState('');
  const { results } = props;

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
    content: style({
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    }),
  };

  const filteredResults = useMemo(
    () =>
      searchTerm
        ? results
            .map((resultsForOneComparison) =>
              resultsForOneComparison.filter(
                (result) =>
                  result.suite.includes(searchTerm) ||
                  result.extra_options.includes(searchTerm) ||
                  result.option_name.includes(searchTerm) ||
                  result.test.includes(searchTerm) ||
                  result.new_rev.includes(searchTerm) ||
                  result.platform.includes(searchTerm),
              ),
            )
            .filter((resultsForOneComparison) => resultsForOneComparison.length)
        : results,
    [results, searchTerm],
  );

  return (
    <Container className={styles.container} data-testid='results-main'>
      <header>
        <div className={styles.title}>Results</div>
        <div className={styles.content}>
          <SearchInput onChange={setSearchTerm} />
          <RevisionSelect />
          <DownloadButton />
        </div>
      </header>
      <ResultsTable results={filteredResults} />
    </Container>
  );
}

export default ResultsMain;
