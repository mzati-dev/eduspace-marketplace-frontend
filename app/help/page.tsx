'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/common/Header';
import { ChevronDown, ChevronUp, Send, Loader2, CheckCircle } from 'lucide-react';
import { supportApiService } from '@/services/api/api';


const FaqItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => (
    <div className="py-4 border-b border-slate-700 last:border-b-0">
        <button onClick={onClick} className="w-full flex justify-between items-center text-left">
            <h3 className="font-semibold text-lg text-white">{question}</h3>
            {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
        </button>
        {isOpen && (
            <div className="pt-2 pr-4">
                <p className="text-slate-400 mt-1">{answer}</p>
            </div>
        )}
    </div>
);


export default function HelpPage() {
    const { user } = useAppContext();
    const [openFaq, setOpenFaq] = useState<number | null>(null);


    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const successTimerRef = useRef<NodeJS.Timeout | null>(null);

    const faqs = [
        { q: "How do I purchase a lesson?", a: "To purchase a lesson, navigate to the 'Available Lessons' page, find a lesson you're interested in, and click the 'Add to Cart' button. You can then complete your purchase from the shopping cart using various payment methods." },
        { q: "Where can I find my purchased lessons?", a: "Once a lesson is purchased, it will appear in your 'My Lessons' section on your main dashboard. You can access it anytime." },
        { q: "How do I reset my password?", a: "You can reset your password by clicking 'Forgot Password?' on the login screen. You will receive an email with instructions to set a new password." },
        ...(user?.role === 'teacher' ? [{ q: "How do I receive payments for my lessons?", a: "You can set up your payout details in the 'Settings' page. We support both bank transfers and mobile money. Payouts are processed automatically at the end of each month." }] : [])
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (successTimerRef.current) {
            clearTimeout(successTimerRef.current);
        }


        if (!subject.trim() || !message.trim()) {
            setError('Please fill out both the subject and message fields.');
            return;
        }

        setIsSubmitting(true);
        try {

            const response = await supportApiService.createSupportTicket({ subject, message });
            setSuccess(response.message || 'Your ticket has been submitted successfully!');

            successTimerRef.current = setTimeout(() => {
                setSuccess(null);
            }, 3000);

            setSubject('');
            setMessage('');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => { if (!user) { window.location.replace('/'); } }, 100);
        return () => clearTimeout(timer);
    }, [user]);

    useEffect(() => {

        return () => {
            if (successTimerRef.current) {
                clearTimeout(successTimerRef.current);
            }
        };
    }, []);

    if (!user) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><p>Loading help center...</p></div>;
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Hero and FAQ Section (No changes here) */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">How can we help?</h1>
                    </div>
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            {faqs.map((faq, index) => (
                                <FaqItem
                                    key={index}
                                    question={faq.q}
                                    answer={faq.a}
                                    isOpen={openFaq === index}
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* --- 3. UPDATE THE CONTACT FORM JSX --- */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
                        <h2 className="text-3xl font-bold mb-2">Still Need Help?</h2>
                        <p className="text-slate-400 mb-6">If you can't find an answer, submit a support ticket and our team will get back to you shortly.</p>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 disabled:opacity-50"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">How can we help?</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 disabled:opacity-50"
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-3 px-5 rounded-md transition flex items-center justify-center disabled:bg-slate-500 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 mr-2" />
                                        Submit Ticket
                                    </>
                                )}
                            </button>
                            {/* Display Success or Error Messages */}
                            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                            {success && (
                                <div className="text-green-400 mt-4 text-center flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    {success}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}