import { useQuery } from "@tanstack/react-query"
import { projectService } from "../services/project.service"


export const useProjectQuery = () => {


    const { data } = useQuery({
        queryKey: ["projects"],
        queryFn: projectService.getAll,
    });

    
    return {
        projects: data
    }
}