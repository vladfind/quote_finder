import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export const TableEntryLoading: React.FC = () => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Skeleton variant="circle">
            <Avatar>13</Avatar>
          </Skeleton>
        }
        title={
          <Skeleton>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil
            </Typography>
          </Skeleton>
        }
        subheader={
          <Skeleton>
            <Typography>S3E15 Lorem, ipsum dolor. </Typography>
          </Skeleton>
        }
      />
      <CardContent>
        <Skeleton width="100" height="2rem" />
        <Skeleton width="100" height="2rem" />
        <Skeleton width="100" height="2rem" />
      </CardContent>
    </Card>
  );
};
