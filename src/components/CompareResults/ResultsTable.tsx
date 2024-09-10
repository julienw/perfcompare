import { Suspense, useState, memo } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Await } from 'react-router-dom';

import type { compareView, compareOverTimeView } from '../../common/constants';
import type { CompareResultsItem } from '../../types/state';
import type { CompareResultsTableConfig } from '../../types/types';
import { getPlatformShortName } from '../../utils/platform';
import TableContent from './TableContent';
import TableHeader from './TableHeader';

const cellsConfiguration: CompareResultsTableConfig[] = [
  {
    name: 'Platform',
    disable: true,
    filter: true,
    key: 'platform',
    gridWidth: '2fr',
    possibleValues: ['Windows', 'OSX', 'Linux', 'Android'],
    matchesFunction: (result: CompareResultsItem, value: string) => {
      const platformName = getPlatformShortName(result.platform);
      return platformName === value;
    },
  },
  {
    name: 'Base',
    key: 'base',
    gridWidth: '1fr',
  },
  {
    key: 'comparisonSign',

    gridWidth: '0.2fr',
  },
  {
    name: 'New',
    key: 'new',

    gridWidth: '1fr',
  },
  {
    name: 'Status',
    disable: true,
    filter: true,
    key: 'status',
    gridWidth: '1.5fr',
    possibleValues: ['No changes', 'Improvement', 'Regression'],
    matchesFunction: (result: CompareResultsItem, value: string) => {
      switch (value) {
        case 'Improvement':
          return result.is_improvement;
        case 'Regression':
          return result.is_regression;
        default:
          return !result.is_improvement && !result.is_regression;
      }
    },
  },
  {
    name: 'Delta(%)',
    key: 'delta',
    gridWidth: '1fr',
  },
  {
    name: 'Confidence',
    disable: true,
    filter: true,
    key: 'confidence',
    gridWidth: '1fr',
    possibleValues: ['Low', 'Medium', 'High'],
    matchesFunction: (result: CompareResultsItem, value: string) =>
      result.confidence_text === value,
  },
  {
    name: 'Total Runs',
    key: 'runs',

    gridWidth: '1fr',
  },
  { key: 'buttons', gridWidth: '2fr' },
  { key: 'expand', gridWidth: '0.2fr' },
];

type Props = {
  filteringSearchTerm: string;
  generation: number;
  resultsPromise: Promise<CompareResultsItem[][]>;
  view: typeof compareView | typeof compareOverTimeView;
};

function ResultsTable({
  filteringSearchTerm,
  resultsPromise,
  view,
  generation,
}: Props) {
  const [tableFilters, setTableFilters] = useState(
    new Map() as Map<string, Set<string>>, // ColumnID -> Set<Values to remove>
  );

  const onClearFilter = (columnId: string) => {
    setTableFilters((oldFilters) => {
      const newFilters = new Map(oldFilters);
      newFilters.delete(columnId);
      return newFilters;
    });
  };

  const onToggleFilter = (columnId: string, filters: Set<string>) => {
    setTableFilters((oldFilters) => {
      const newFilters = new Map(oldFilters);
      newFilters.set(columnId, filters);
      return newFilters;
    });
  };

  const rowGridTemplateColumns = cellsConfiguration
    .map((config) => config.gridWidth)
    .join(' ');

  return (
    <Box
      data-testid='results-table'
      role='table'
      sx={{ marginTop: 3, paddingBottom: 3 }}
    >
      <TableHeader
        cellsConfiguration={cellsConfiguration}
        filters={tableFilters}
        onToggleFilter={onToggleFilter}
        onClearFilter={onClearFilter}
      />
      {/* Using a key in Suspense makes it that it displays the fallback more
        consistently.
        See https://github.com/mozilla/perfcompare/pull/702#discussion_r1705274740
        for more explanation (and questioning) about this issue. */}
      <Suspense
        fallback={
          <Box display='flex' justifyContent='center' sx={{ marginTop: 3 }}>
            <CircularProgress />
          </Box>
        }
        key={generation}
      >
        <Await resolve={resultsPromise}>
          {(resolvedResults) => (
            <TableContent
              cellsConfiguration={cellsConfiguration}
              results={resolvedResults as CompareResultsItem[][]}
              filteringSearchTerm={filteringSearchTerm}
              tableFilters={tableFilters}
              view={view}
              rowGridTemplateColumns={rowGridTemplateColumns}
            />
          )}
        </Await>
      </Suspense>
    </Box>
  );
}

export default memo(ResultsTable);
