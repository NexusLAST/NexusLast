import { Layout } from "@/Layout/Layout";
import { EventForm } from "@/Events/EventForm";

export default function CreateEvent() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <EventForm />
      </div>
    </Layout>
  );
}
