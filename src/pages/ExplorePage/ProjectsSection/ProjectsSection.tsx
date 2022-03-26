
import ProjectsRow from "../ProjectsRow/ProjectsRow";
import ProjectsRowSkeleton from "../ProjectsRow/ProjectsRow.Skeleton";
import { MdLocalFireDepartment } from "react-icons/md";
import { useExploreProjectsQuery } from "src/graphql";


export default function ProjectsSection() {

    const { data, loading } = useExploreProjectsQuery();


    if (loading || !data) return <div className='mt-32 lg:mt-48'>
        {Array(3).fill(0).map((_, idx) => <ProjectsRowSkeleton key={idx} />)}
    </div>;

    return (
        <div className='mt-32 lg:mt-48'>
            <ProjectsRow title={<><span className="align-middle mr-8">Newest</span> <MdLocalFireDepartment className='inline-block text-fire scale-125 ' /></>}
                categoryId={0}
                projects={data.newProjects} />
            {data.allCategories.map(({ id, title, project, }) => {
                if (project)
                    return <ProjectsRow
                        key={id}
                        categoryId={id}
                        title={title}
                        projects={project.map(p => ({ ...p, category: { id, title } }))} />
                else return null
            })}
        </div>
    )
}
