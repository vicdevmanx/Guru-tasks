
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, X, Smile, Paperclip } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

interface ProjectChatProps {
  projectId: string;
  onClose: () => void;
}

export const ProjectChat: React.FC<ProjectChatProps> = ({ projectId, onClose }) => {
  const { getProjectChatMessages, addChatMessage } = useProjects();
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const chatMessages = getProjectChatMessages(projectId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addChatMessage(projectId, message, 'You');
    setMessage('');
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Chat Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 lg:w-96 bg-card border-l shadow-2xl z-50 transition-all duration-300 ease-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Card className="h-full flex flex-col border-0 rounded-none shadow-none">
          <CardHeader className="pb-3 border-b flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Project Chat</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-accent transition-smooth"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 py-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 animate-fade-in">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                      <Smile className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3 animate-fade-in">
                      <Avatar className="w-8 h-8 ring-2 ring-border">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {msg.sender.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{msg.sender}</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="bg-accent/50 rounded-lg p-3 border">
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="pr-20 transition-smooth focus:ring-2 focus:ring-primary"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-accent transition-smooth"
                    >
                      <Paperclip className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-accent transition-smooth"
                    >
                      <Smile className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="px-3 transition-smooth hover:scale-105"
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
