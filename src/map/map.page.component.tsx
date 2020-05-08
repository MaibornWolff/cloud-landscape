import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import {Grid, styled} from '@material-ui/core';
import {DemoData, Providers} from '../assets/data/dataType';
import DetailModal from './components/detailModal/detailModal.component';
import Loading from './components/laoding/loading.component';
import MapTable from './components/maptable/maptable.component';
import fetchAllServices from '../shared/mongodbConnection';
import Landscape from './components/landscape/landscape.component';
import {FilterComponent} from '../shared/components/filter/filter.container.component';
import Paper from '@material-ui/core/Paper';

export interface Props {
  loading: boolean;
  detailService: DemoData;
  filteredContent: Array<DemoData>;
  content: Array<DemoData>;
  providers: Array<Providers>;
  categories: Array<string>;
  setContent: (object: Array<DemoData>) => void;
  setDetailService: (object: DemoData) => void;
  deleteDetailService: () => void;
}

const StyledPaper = styled(Paper)({
  width: '100%',
  overflowX: 'auto',
});

export default class MapComponent extends React.Component<Props> {
  componentDidMount() {
    fetchAllServices().then((data: DemoData[]) => this.props.setContent(data));
  }

  // "nested" map that provides all services for a given provider and category
  getGroupedContent: () => Map<Providers, Map<string, DemoData[]>> = () =>
    this.props.content.reduce(
      (
        providersMap: Map<Providers, Map<string, DemoData[]>>,
        service: DemoData
      ) => {
        // get the map with all categories for the provider of service
        const categoriesMap =
          providersMap.get(service.provider) || new Map<string, DemoData[]>();
        // add the service to every category group it belongs to
        service.category.forEach(category => {
          const group = categoriesMap.get(category) || [];
          categoriesMap.set(category, [...group, service]);
        });
        return providersMap.set(service.provider, categoriesMap);
      },
      new Map()
    );

  public render() {
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{minHeight: 600, marginTop: 40}}
      >
        {Object.keys(this.props.detailService).length !== 0 && (
          <DetailModal
            service={this.props.detailService}
            deleteDetailService={this.props.deleteDetailService}
          />
        )}
        {this.props.loading ? (
          <Loading />
        ) : (
          <Grid item xs={11}>
            <FilterComponent displayChips={true} />
            <StyledPaper>
              <Switch>
                <Route path="/landscape">
                  <Landscape
                    filteredContent={this.props.filteredContent}
                    content={this.getGroupedContent()}
                    providers={this.props.providers}
                    categories={this.props.categories}
                    setDetailService={this.props.setDetailService}
                  />
                </Route>
                <Route path="/table">
                  <MapTable
                    content={this.props.filteredContent}
                    setDetailService={this.props.setDetailService}
                  />
                </Route>
                <Redirect to="/landscape" />
              </Switch>
            </StyledPaper>
          </Grid>
        )}
      </Grid>
    );
  }
}
