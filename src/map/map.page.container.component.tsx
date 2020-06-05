import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {State} from '../reducers';
import {
  getDetailService,
  getFilteredContent,
  getLoadingStatus,
  getGroupedContent,
  getCategories,
  getProviders,
  getZoomFactor,
  getContentSize,
} from './selectors/map.selector';
import {
  deleteDetailService,
  setContent,
  setDetailService,
} from './actions/map.actions';
import MapComponent from './map.page.component';

import {DemoData} from '../assets/data/dataType';
import {getCredentials} from '../admin/selectors/admin.selector';
import {withRouter} from 'react-router';

const mapStateToProps = (state: State) => ({
  loading: getLoadingStatus(state.Map),
  filteredContent: getFilteredContent(state.Map),
  contentSize: getContentSize(state.Map),
  groupedContent: getGroupedContent(state.Map),
  detailService: getDetailService(state.Map),
  providers: getProviders(state.Map),
  categories: getCategories(state.Map),
  zoomFactor: getZoomFactor(state.Map),
  adminCredentials: getCredentials(state.Admin),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setContent: (content: DemoData[]) => dispatch(setContent(content)),
  setDetailService: (service: DemoData) => dispatch(setDetailService(service)),
  deleteDetailService: () => dispatch(deleteDetailService()),
});

export const Map = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MapComponent));
