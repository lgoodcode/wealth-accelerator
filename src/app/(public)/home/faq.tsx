import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQ({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Accordion type="single" collapsible className="w-full shadow-main p-8 lg:p-12">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl data-[state=closed]:text-muted-foreground">
            Is it accessible?
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 text-lg">Yes. It adheres to the WAI-ARIA design pattern.</div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl data-[state=closed]:text-muted-foreground">
            Is it styled?
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 text-lg">Yes. It adheres to the WAI-ARIA design pattern.</div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl data-[state=closed]:text-muted-foreground">
            Is it animated?
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 text-lg">Yes. It adheres to the WAI-ARIA design pattern.</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
