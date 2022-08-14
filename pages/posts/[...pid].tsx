 import {InferGetServerSidePropsType, NextPage} from "next";

export const getServerSideProps = async () => {


    return {
        props: {
            pid: false,
        },
    };
}

const Post: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
    return (
        <h1>{props.pid}</h1>
    );
}

export default Post;