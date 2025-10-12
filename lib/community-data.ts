export interface Post {
  id: string
  user_id: string
  author: string
  avatar: string
  department: string
  departmentCode: string
  campus: string
  campusCode: string
  semester: string
  batch: string // e.g., 'FA22-BSE'
  time: string
  content: string
  likes: number
  comments: number
  shares: number
  tags: string[]
  liked: boolean
  type: string
  media?: MediaItem[]
  location?: string
  feeling?: string
  visibility?: 'public' | 'followers' | 'private'
  is_pinned?: boolean
  is_edited?: boolean
  edited_at?: string
  views_count?: number
  created_at: string
  updated_at?: string
}

export interface MediaItem {
  id: string
  type: 'image' | 'video' | 'document'
  url: string
  thumbnail?: string
  alt?: string
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

export interface Comment {
  id: string
  post_id: string
  parent_id?: string | null
  user_id: string
  author: string
  avatar: string
  content: string
  likes_count: number
  replies_count: number
  media?: MediaItem[]
  mentions?: string[]
  is_edited?: boolean
  edited_at?: string
  created_at: string
  updated_at?: string
  liked: boolean
  user?: {
    id: string
    email: string
  }
}

export interface Reaction {
  id: string
  post_id: string
  user_id: string
  reaction_type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry'
  created_at: string
}

export interface Group {
  id: string
  name: string
  description: string
  members_count: number
  posts_count: number
  is_joined: boolean
  category: string
  is_private?: boolean
  avatar_url?: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  attendees_count: number
  is_online?: boolean
  category?: string
  status?: 'upcoming' | 'ongoing' | 'completed'
  image_url?: string
  created_by: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  actor_id: string
  type: 'like' | 'comment' | 'reply' | 'follow' | 'mention' | 'tag' | 'group_invite' | 'event_reminder'
  title: string
  message: string
  entity_type?: string
  entity_id?: string
  action_url?: string
  is_read: boolean
  read_at?: string
  created_at: string
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  name?: string
  avatar_url?: string
  participants: ConversationParticipant[]
  last_message?: Message
  last_message_at?: string
  created_at: string
  updated_at: string
}

export interface ConversationParticipant {
  id: string
  conversation_id: string
  user_id: string
  role: 'admin' | 'member'
  joined_at: string
  last_read_at?: string
  is_muted: boolean
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  sender_avatar: string
  content?: string
  media?: MediaItem[]
  reply_to_id?: string
  reply_to?: Message
  is_edited: boolean
  edited_at?: string
  is_deleted: boolean
  reactions?: Record<string, string> // {user_id: reaction_type}
  created_at: string
  updated_at?: string
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
