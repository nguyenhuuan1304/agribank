import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import TransactionTable from "./TransactionTable";

export function TabsHeader() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="unsubmitted">
        <TabsList className="flex gap-2">
          <TabsTrigger value="unsubmitted">Báo cáo chưa bổ sung</TabsTrigger>
          <TabsTrigger value="overdue">Báo cáo quá hạn</TabsTrigger>
        </TabsList>
        <TabsContent value="unsubmitted">
          <TransactionTable />
        </TabsContent>
        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">Current password</Label>
                <Input id="tabs-demo-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">New password</Label>
                <Input id="tabs-demo-new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
