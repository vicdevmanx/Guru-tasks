
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, Send } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

interface ProjectChatProps {
  projectId: string;
  onClose: () => void;
}

export const ProjectChat: React.FC<ProjectChatProps> = ({
  projectId,
  onClose,
}) => {
  const { getProjectChatMessages, addChatMessage } = useProjects();
  const [message, setMessage] = useState('');
  const messages = getProjectChatMessages(projectId);

  const handleSendMessage = () => {
    if (message.trim()) {
      addChatMessage(projectId, message.trim(), 'John Doe');
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed right-4 bottom-4 w-80 h-96 z-50">
      <Card className="h-full flex flex-col shadow-lg">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Project Chat</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-3 space-y-3">
          <div className="flex-1 overflow-y-auto space-y-2">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No messages yet. Start the conversation!
              </p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {msg.sender.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{msg.sender}</span>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="text-sm"
            />
            <Button size="sm" onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
