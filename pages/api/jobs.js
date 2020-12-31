// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetch from 'isomorphic-unfetch';

export default async (req, res) => {
    const zippiaResp = await fetch('https://www.zippia.com/api/jobs/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },        
        body: JSON.stringify({ 
            companySkills: true, 
            dismissedListingHashes: [], 
            fetchJobDesc: true, 
            jobTitle: "Business Analyst",
            locations: [],
            numJobs: 20,
            previousListingHashes: []
        }),
    });
    const data = await zippiaResp.json();
    const { jobs } = data;
    res.statusCode = 200;
    res.json({ jobs })    
  }
  