import { User } from "src/graphql";
import { posts } from "./posts";

export const user: User = {
    id: 123,
    email: "mtg0987654321@gmail.com",
    avatar: "https://avatars.dicebear.com/api/bottts/Mtgmtg.svg",
    bio: "Lorem asiop asklh kluiw wekjhl shkj kljhsva klu khsc klhlkbs mjklwqr kmlk sadlfui mewr qiumnk, asdjomi cskhsdf.",
    name: "123123124asdfsadfsa8d7fsadfasdf",
    github: "MTG2000",
    jobTitle: "Front-end Web Developer",
    join_date: new Date(2021).toISOString(),
    lightning_address: "mtg@getalby.com",
    linkedin: "https://www.linkedin.com/in/mtg-softwares-dev/",
    location: "Germany, Berlin",
    role: "user",
    twitter: "john-doe",
    website: "https://mtg-dev.tech",
    stories: posts.stories,
    nostr_prv_key: "123123124asdfsadfsa8d7fsadfasdf",
    nostr_pub_key: "123124123123dfsadfsa8d7f11sadfasdf",
}
