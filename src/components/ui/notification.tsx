import { Link } from "react-router-dom";

//Icons
import { Bell, ClipboardList, GraduationCap, Users, Clock } from "lucide-react";

//Components
import { Badge } from "./badge/badge";
import { Button } from "./button/button";
import { ScrollArea } from "./scrollArea/scrollArea";
import { Popover, PopoverContent, PopoverTrigger } from "./popover/popover";

//Utils
import { cn } from "../../utils/utils";

export const mockNotifications = [
  {
    id: 1,
    title: "New Student Enrollment",
    description:
      "Alice Robinson has completed her enrollment for Grade 9 - Section C.",
    time: "2 mins ago",
    read: false,
    icon: Users,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/50",
  },
  {
    id: 2,
    title: "Grade Submission Pending",
    description:
      "Math Teacher (Mr. Thompson) has uploaded mid-term results for Grade 11.",
    time: "45 mins ago",
    read: false,
    icon: GraduationCap,
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50",
  },
  {
    id: 3,
    title: "Attendance Warning",
    description:
      "Attendance below 75% for Benjamin Lee from the Sports Department.",
    time: "1 hour ago",
    read: false,
    icon: ClipboardList,
    color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
  },
  {
    id: 4,
    title: "Library Overdue",
    description:
      '"Advanced Physics Vol 2" is overdue for return by Michael Smith.',
    time: "5 hours ago",
    read: true,
    icon: Clock,
    color: "text-rose-500 bg-rose-50 dark:bg-rose-950/50",
  },
  {
    id: 5,
    title: "System Maintenance",
    description: "Server maintenance scheduled for tonight at 12:00 AM.",
    time: "6 hours ago",
    read: true,
    icon: Bell,
    color: "text-purple-500 bg-purple-50 dark:bg-purple-950/50",
  },
  {
    id: 6,
    title: "New Event Registration",
    description: "Parent-Teacher Meeting registrations have started.",
    time: "1 day ago",
    read: true,
    icon: Users,
    color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50",
  },
  {
    id: 7,
    title: "Fee Payment Received",
    description: "Payment of $450 received from Sarah Connor.",
    time: "1 day ago",
    read: true,
    icon: ClipboardList,
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50",
  },
  {
    id: 8,
    title: "New Staff Profile",
    description: "HR added a new profile for Jane Doe (Science Teacher).",
    time: "1 day ago",
    read: true,
    icon: Users,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/50",
  },
  {
    id: 9,
    title: "Assignment Deadline",
    description: "Science Project submissions are closing in 24 hours.",
    time: "2 days ago",
    read: true,
    icon: Clock,
    color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
  },
  {
    id: 10,
    title: "Transport Alert",
    description: "Route 4 is delayed by 15 minutes due to heavy traffic.",
    time: "2 days ago",
    read: true,
    icon: Bell,
    color: "text-rose-500 bg-rose-50 dark:bg-rose-950/50",
  },
  {
    id: 11,
    title: "Holiday Announcement",
    description: "School will be closed next Monday for Memorial Day.",
    time: "3 days ago",
    read: true,
    icon: Bell,
    color: "text-purple-500 bg-purple-50 dark:bg-purple-950/50",
  },
  {
    id: 12,
    title: "Exam Schedule Updated",
    description: "The final exam timetable for Grade 12 has been published.",
    time: "3 days ago",
    read: true,
    icon: GraduationCap,
    color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50",
  },
  {
    id: 13,
    title: "Teacher Leave Request",
    description: "Mr. John (History) requested a leave of absence for Friday.",
    time: "4 days ago",
    read: true,
    icon: Users,
    color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
  },
  {
    id: 14,
    title: "Classroom Booking",
    description: "Auditorium booked for Annual Day Rehearsal.",
    time: "4 days ago",
    read: true,
    icon: ClipboardList,
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50",
  },
  {
    id: 15,
    title: "Cafeteria Menu Update",
    description: "New items added to the online lunch pre-ordering system.",
    time: "5 days ago",
    read: true,
    icon: Bell,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/50",
  },
  {
    id: 16,
    title: "Quarterly Audit",
    description: "Financial audit report is ready for download.",
    time: "1 week ago",
    read: true,
    icon: ClipboardList,
    color: "text-purple-500 bg-purple-50 dark:bg-purple-950/50",
  },
  {
    id: 17,
    title: "Software Update",
    description: "Admin Portal v2.0 deployed successfully.",
    time: "1 week ago",
    read: true,
    icon: Bell,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/50",
  },
  {
    id: 18,
    title: "Parent Complaint",
    description: "A new grievance ticket has been filed regarding transport.",
    time: "1 week ago",
    read: true,
    icon: Users,
    color: "text-rose-500 bg-rose-50 dark:bg-rose-950/50",
  },
  {
    id: 19,
    title: "Curriculum Change",
    description: "Math syllabus updated for the spring semester.",
    time: "2 weeks ago",
    read: true,
    icon: GraduationCap,
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50",
  },
  {
    id: 20,
    title: "Welcome to the System",
    description: "Your administrative account has been fully set up.",
    time: "2 weeks ago",
    read: true,
    icon: Bell,
    color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50",
  },
];

export function Notifications() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 flex items-center justify-center p-0 text-[10px] bg-rose-500 hover:bg-rose-600">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 overflow-hidden"
        align="end"
        sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-primary hover:text-primary/80 px-2">
            Mark all read
          </Button>
        </div>

        <ScrollArea className="h-[350px]">
          <div className="flex flex-col">
            {mockNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={cn(
                  "relative flex gap-3 p-4 transition-colors hover:bg-muted/50 cursor-pointer",
                  !notification.read && "bg-primary/5",
                  index !== mockNotifications.length - 1 &&
                    "border-b border-border/50",
                )}>
                {!notification.read && (
                  <div className="absolute left-1.5 top-3 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky-500" />
                )}

                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    notification.color,
                  )}>
                  <notification.icon className="h-5 w-5" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xs font-semibold leading-none">
                      {notification.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
                    {notification.description}
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {notification.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-2 border-t bg-muted/30 flex justify-center">
          <Link to="/notifications" className="w-full">
            <Button
              variant="ghost"
              className="w-full h-8 text-xs text-muted-foreground hover:text-foreground">
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
