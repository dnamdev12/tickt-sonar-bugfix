export interface FetchResponse {
    milestonesCount: number,
    newJobsCount: number
}

export const milestonesCount: any = (state: any) => state.jobs.milestonesCount;
export const newJobsCount: any = (state: any) => state.jobs.newJobsCount;