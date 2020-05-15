import React, {useEffect} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Typography} from '@material-ui/core';
import {DemoData, Providers} from '../../../assets/data/dataType';
import ServiceButton from './servicebutton.component';

interface Props {
  setDetailService: (service: DemoData) => void;
  providers: Array<Providers>;
  categories: Array<string>;
  groupedContent: Map<Providers, Map<string, DemoData[]>>;
  filteredContent: Array<DemoData>;
  zoomFactor: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 100,
    },
    tableCell: (props: {zoomFactor: number}) => ({
      fontSize: `${props.zoomFactor * 100}%`,
      paddingTop: `${Math.min(1, props.zoomFactor) * 6}px`,
      paddingRight: `${Math.min(1, props.zoomFactor) * 24}px`,
      paddingBottom: `${Math.min(1, props.zoomFactor) * 6}px`,
      paddingLeft: `${Math.min(1, props.zoomFactor) * 16}px`,
    }),
    header: {
      backgroundColor: theme.palette.primary.main,
    },
    headerTitle: {
      color: 'white',
      margin: 0,
    },
  })
);

export default function Landscape(props: Props) {
  const classes = useStyles({zoomFactor: props.zoomFactor});
  const firstUnfilteredService = React.createRef<HTMLButtonElement>();

  useEffect(() => {
    firstUnfilteredService.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  });

  const providers = props.providers.sort();
  const categories = props.categories.sort();
  const setDetailService = (service: DemoData) => {
    props.setDetailService(service);
  };

  const getServicesByProviderAndCategory = (
    provider: Providers,
    category: string
  ): Array<DemoData> => props.groupedContent.get(provider)?.get(category) || [];

  const isServiceFiltered = (service: DemoData): boolean =>
    !props.filteredContent.includes(service);

  const renderCategories = () => {
    let noUnfilteredServiceYet = true;
    return categories.map((category, i) => (
      <TableRow key={i}>
        <TableCell component="th" scope="row" className={classes.tableCell}>
          {category}
        </TableCell>
        {providers.map((provider, j) => (
          <TableCell key={j} className={classes.tableCell}>
            {getServicesByProviderAndCategory(provider, category).map(
              (service, index) => {
                const isFiltered = isServiceFiltered(service);
                const isFirstUnfiltered = noUnfilteredServiceYet && !isFiltered;
                if (isFirstUnfiltered) noUnfilteredServiceYet = false;
                return (
                  <ServiceButton
                    key={index}
                    service={service}
                    setDetailService={setDetailService}
                    isFiltered={isFiltered}
                    zoomFactor={props.zoomFactor}
                    buttonRef={
                      isFirstUnfiltered ? firstUnfilteredService : undefined
                    }
                  />
                );
              }
            )}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <Table className={classes.table} size="small">
      <TableHead className={classes.header}>
        <TableRow>
          <TableCell />
          {providers.map((provider, j) => (
            <TableCell key={j}>
              <Typography
                variant="h6"
                gutterBottom
                className={classes.headerTitle}
              >
                {provider}
              </Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {renderCategories()}
        {!categories.length && (
          <TableRow>
            <TableCell>Empty</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
