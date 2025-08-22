export interface Post {
  id: string
  author: string
  avatar: string
  department: string
  semester: string
  time: string
  content: string
  likes: number
  comments: number
  shares: number
  tags: string[]
  liked: boolean
  type: string
}

export interface Reply {
  id: string
  postId: string
  author: string
  avatar: string
  time: string
  content: string
  likes: number
  liked: boolean
}

export const mockReplies: Reply[] = [
  {
    id: "1",
    postId: "1",
    author: "Zainab Ahmed",
    avatar: "/female-student-avatar.png",
    time: "1 hour ago",
    content: "This is super helpful! I was looking for a good starting point for my FYP. Can you share the dataset you used?",
    likes: 5,
    liked: false,
  },
  {
    id: "2",
    postId: "1",
    author: "Ahmad Hassan",
    avatar: "/student-avatar.png",
    time: "30 minutes ago",
    content: "Sure! I've uploaded the dataset to a public repo. Here is the link: [link]. Let me know if you have any questions.",
    likes: 8,
    liked: true,
  },
  {
    id: "3",
    postId: "2",
    author: "Usman Ali",
    avatar: "/male-student-avatar.png",
    time: "2 hours ago",
    content: "I'm in! I'm struggling with the chapter on transmission lines. A study group would be great.",
    likes: 3,
    liked: false,
  },
]
