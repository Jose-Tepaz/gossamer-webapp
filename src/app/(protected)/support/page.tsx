"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  HelpCircle,
  Send,
  CheckCircle
} from "lucide-react"


const FAQ_ITEMS = [
  {
    question: "How do I connect my brokerage account?",
    answer: "Go to the Connect Broker page and follow the step-by-step instructions. We support most major brokers including Binance, Coinbase, and more."
  },
  {
    question: "What investment models are available?",
    answer: "You can create custom investment models with different asset allocations. We provide templates for conservative, moderate, and aggressive strategies."
  },
  {
    question: "How often should I rebalance my portfolio?",
    answer: "We recommend rebalancing quarterly or when your allocation drifts more than 5% from your target. You can set up automatic alerts."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use bank-level encryption and never store your brokerage credentials. All connections are read-only and secure."
  }
]

const SUPPORT_CHANNELS = [
  {
    name: "Live Chat",
    description: "Get instant help from our support team",
    icon: <MessageCircle className="w-6 h-6" />,
    available: true,
    responseTime: "2-5 minutes"
  },
  {
    name: "Email Support",
    description: "Send us a detailed message",
    icon: <Mail className="w-6 h-6" />,
    available: true,
    responseTime: "24 hours"
  },
  {
    name: "Phone Support",
    description: "Call us directly (Premium only)",
    icon: <Phone className="w-6 h-6" />,
    available: false,
    responseTime: "1 hour"
  }
]

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("faq")
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "medium"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleFAQToggle = (index: number) => {
    setSelectedFAQ(selectedFAQ === index ? null : index)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitted(true)
      setContactForm({ subject: "", message: "", priority: "medium" })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Support Center</h1>
                <p className="text-muted-foreground">
                  Get help with your account, portfolio management, and more
                </p>
              </div>

              {/* Support Channels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {SUPPORT_CHANNELS.map((channel) => (
                  <Card key={channel.name} className="text-center">
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-3">
                        <div className={`p-3 rounded-full ${
                          channel.available ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"
                        }`}>
                          {channel.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold mb-1">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {channel.responseTime}
                      </div>
                      {!channel.available && (
                        <Badge variant="secondary" className="mt-2">Premium Only</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tabs */}
              <div className="space-y-6">
                <div className="flex space-x-4 border-b">
                  <Button
                    variant={activeTab === "faq" ? "default" : "ghost"}
                    onClick={() => setActiveTab("faq")}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQ
                  </Button>
                  <Button
                    variant={activeTab === "contact" ? "default" : "ghost"}
                    onClick={() => setActiveTab("contact")}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </Button>
                </div>

                {/* FAQ Tab */}
                {activeTab === "faq" && (
                  <div className="space-y-4">
                    {FAQ_ITEMS.map((item, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <button
                            className="w-full text-left flex items-center justify-between"
                            onClick={() => handleFAQToggle(index)}
                          >
                            <h3 className="font-medium">{item.question}</h3>
                            <span className="text-muted-foreground">
                              {selectedFAQ === index ? "−" : "+"}
                            </span>
                          </button>
                          {selectedFAQ === index && (
                            <p className="mt-3 text-sm text-muted-foreground">
                              {item.answer}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Contact Tab */}
                {activeTab === "contact" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Send us a message</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {submitted ? (
                        <div className="text-center py-8">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                          <p className="text-muted-foreground">
                            We&apos;ll get back to you within 24 hours.
                          </p>
                          <Button
                            onClick={() => setSubmitted(false)}
                            className="mt-4"
                          >
                            Send Another Message
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Subject</label>
                            <Input
                              value={contactForm.subject}
                              onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                              placeholder="Brief description of your issue"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 block">Priority</label>
                            <select
                              value={contactForm.priority}
                              onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 block">Message</label>
                            <Textarea
                              value={contactForm.message}
                              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                              placeholder="Please describe your issue in detail..."
                              rows={5}
                              required
                            />
                          </div>
                          
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                          >
                            {isSubmitting ? (
                              "Sending..."
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
    </div>
  )
}
