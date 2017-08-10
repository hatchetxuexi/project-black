import _ from 'lodash'
import { connect } from 'react-redux'

import ProjectDetails from './ProjectDetails.jsx'
import { updateComment as updateProjectComment } from '../../redux/projects/actions'
import { updateComment as updateScopeComment } from '../../redux/scopes/actions'
import { updateFilters } from '../../redux/filters/actions'


function formIPs(ips_list, project_uuid) {
    var ips = _.filter(ips_list, (x) => {
        return x.project_uuid == project_uuid
    }).sort((a, b) => {
        if (a.ip_address < b.ip_address) return -1
        if (a.ip_address > b.ip_address) return 1
        return 0
    });

    return ips;
}

function formHosts(hosts_list, project_uuid, scans) {
    var hosts = _.filter(hosts_list, (x) => {
        return x.project_uuid == project_uuid
    }).sort((a, b) => {
        if (a.hostname < b.hostname) return -1
        if (a.hostname > b.hostname) return 1
        return 0
    });

    return hosts
}

function formScans(scans, project_uuid) {
    return _.filter(scans, (x) => {
        return x.project_uuid == project_uuid
    }); 
}

function mapStateToProps(state, ownProps){
    let project_uuid = ownProps.project_uuid;
    let filtered_projects = _.filter(state.projects, (x) => {
        return x.project_uuid == project_uuid
    });

    let project = null;

    if (filtered_projects.length) {
        project = filtered_projects[0]
    } else {
        project = {
            "project_name": null,
            "project_uuid": null,
            "comment": ""
        }
    }

    let scans = formScans(state.scans, project['project_uuid']);

    return {
        project: project,
        scopes: {
            'ips': formIPs(state.scopes.ips, project['project_uuid']),
            'hosts': formHosts(state.scopes.hosts, project['project_uuid'], scans)
        },
        tasks: _.filter(state.tasks.active, (x) => {
            return x.project_uuid == project['project_uuid']
        }),
        scans: scans,
        filters: state.filters.ips
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        onFilterChangeIPs: (ipsFilters) => {
            dispatch(updateFilters({
                'ips': ipsFilters
            }))             
        }
    }
}

const ProjectDetailsWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectDetails)

export default ProjectDetailsWrapper