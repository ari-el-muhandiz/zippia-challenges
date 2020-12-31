
/*
Page that show list of jobs from zippia api
@author Ari Firmanto <https://github.com/ari-el-muhandiz>
*/

// inport library needed
import { Card, Row, Col, Layout, Button, Popover, Spin } from 'antd';
import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
const { Header, Footer, Content } = Layout;
import PopoverContent from '../../components/popover-content';
import styles from '../../styles/Job.module.css';

// function that return HTML element that used in job card
const CardTitle = (job) => {
    return (
        <>
            <div className={styles.companyName}>{job.companyName}</div>
            <div className={styles.jobTitle}>{job.jobTitle}</div>
        </>
    )
}

const JobPage = () => {
    // state that contains the job list
    const [jobs, setJobs] = useState([]);
    // same with state above, but this state to hold all data that used the restore jobs state into original data
    const [defaultJobs, setDefaultJobs] = useState([]);
    // loading state
    const [isLoading, setIsLoading] = useState(false);
    // state when button published clicked
    const [isPublishedClicked, setIsPublishedClicked] = useState(false);
    // state when apply filter company is triggered
    const [isFilterCompany, setIsFilterCompany] = useState(false);
    // state to get all companies from data in order to use auto complete options
    const [companies, setCompanies] = useState([]);
    // state to toggle popover when filter by company button clicked
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    // state to hold the selected company
    const [selectedCompany, setSelectedCompany] = useState('');
    // state to hold all selected company and save it into array
    const [companyOptions, setCompanyOptions] = useState([]);
    
    // do something after render (did mount)
    useEffect(async () => {
        // call the api
        setIsLoading(true);
        const resp = await fetch('/api/jobs');
        const data = await resp.json();
        // take 10 data only, as described in requirement
        const slicedData = data.jobs.slice(0, 10)
        setIsLoading(false);
        
        // set all companies and jobs
        setCompanies(slicedData.map((job) => job.companyName));
        setJobs(slicedData);
        setDefaultJobs(slicedData);
    }, []);
    
    // effect triggered when there is change in isPublishedClicked and selectedCompany
    useEffect(() => {
        // handle both filter, must do the intersection from jobs state
        if (isPublishedClicked && isFilterCompany) {
            const filteredJobs = jobs.filter((job) => job.postedDate === '7d ago' && job.companyName === selectedCompany);
            setJobs(filteredJobs)       
        }
        // handle published filter
        else if (isPublishedClicked) {
            // use defaultJobs because it holds the all data
            const filteredJobs = defaultJobs.filter((job) => job.postedDate === '7d ago');
            setJobs(filteredJobs)
        } 
        // handle company filter
        else if (isFilterCompany) {
            // use defaultJobs because it holds the all data
            const filteredJobs = defaultJobs.filter((job) => job.companyName === selectedCompany);
            setJobs(filteredJobs)
        }
        else {
            // clear filter
            setJobs(defaultJobs);
        }
    }, [isPublishedClicked, selectedCompany]);
    
    // toggle when published filter clicked
    const onPublishedClicked = () => {
        setIsPublishedClicked(!isPublishedClicked);
    }
    
    // toggle when button filter company is clicked
    const onFilterCompanyClicked = () => {
        setIsPopoverVisible(true);
    }
    
    // function to handle clear company filter
    const onHandleClearFilter = () => {
        // close popover
        setIsPopoverVisible(false);
        // reset company options and selected company
        setCompanyOptions([]);
        setSelectedCompany('')
        setIsFilterCompany(false);
    }

    // function handle filter company
    const onHandleApplyFilter = (value) => {
        // close popover
        setIsPopoverVisible(false);
        // set selected company
        setSelectedCompany(value);
        // adding in company options if not exists in array
        const idxCompany = companyOptions.findIndex((com) => com === value);
        if (idxCompany === -1) {
            companyOptions.push(value);
            setCompanyOptions(companyOptions);    
        }
        setIsFilterCompany(true);
    }
    
    return (
    <>
        <Layout>
            <Header className={styles.header}><h1>Zippia Test Job</h1></Header>
            <Content className={styles.main}> 
                <div className={styles.buttonContainer}>
                    <Popover 
                      trigger="click" 
                      placement="bottom" 
                      content={
                        <PopoverContent 
                          options={companies} 
                          inputPlaceHolder="Company Name" 
                          onClearFilter={onHandleClearFilter}
                          onApplyFilter={onHandleApplyFilter}
                          selectedValue={selectedCompany}
                          valueOptions={companyOptions}
                        />
                      } 
                      title="Filter by Company Name"
                      visible={isPopoverVisible}>
                        <Button 
                          type={isFilterCompany ? 'primary' : 'default'} 
                          onClick={onFilterCompanyClicked}>
                              {selectedCompany || 'Filter by Company Name'}
                        </Button>
                    </Popover>
                    <Button 
                      type={isPublishedClicked ? 'primary' : 'default'} 
                      onClick={onPublishedClicked}>
                          Published Last 7 days
                    </Button>
                </div>
                {isLoading ? (
                    <div className={styles.spinContainer}>
                        <Spin size="large"/>
                    </div>
                ) : (
                    <Row  className={styles.row}>
                    {jobs.map((job) => (
                        <Col className={styles.column} xl={4} xxl={4} lg={6} key={job.jobId}>
                            <Card title={CardTitle(job)} className={styles.card}>
                                <div className={styles.jobDescription}>{job.shortDesc}</div>
                            </Card>
                        </Col>
                    ))}
                   </Row>
                )}
                    
            </Content>
            <Footer className={styles.footer}>Copyright 2020</Footer>
        </Layout>
    </>
    )
}

export default JobPage;