
class Epic {}
class Story {}
class Task {}


type RequestHeader = { [key: string]: string };


class EpicIssue {

}

interface IssueType {
  id?: string;
  name: string;
  subtask: boolean;
  description?: string;
}


abstract class Query {
  readonly key: string = '';
  protected abstract value(): string;
  toString(): string {
    return `${this.key}=${this.value()}`;
  }
}

